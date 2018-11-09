#!/bin/bash -l

set -eu

usage() {
    echo >&2 "usage: $0 EDGES NAME DATABASE"
    echo >&2
    echo >&2 "EDGES    file with edges, one per line"
    echo >&2 "NAME     name of extension"
    echo >&2 "DATABASE MySQL database name"
    echo >&2
    echo >&2 "The edge file should be whitespace separated and contain five fields: gene1, network1, gene2, network2, score."
}

if [[ $# < 3 ]]; then
    echo >&2 "error: too few arguments"
    usage
    exit 1
fi

if [[ ! -f "$1" ]]; then
    echo >&2 "error: file or directory not found: $1"
fi

input="$1"
name="$2"
database="$3"

read -p "MySQL user: " mysql_user
read -sp "MySQL password: " mysql_pwd
echo

# Test password
if ! mysql \
    --user=$mysql_user \
    --password=$mysql_pwd \
    --database=$database \
    --execute='quit' \
    >/dev/null 2>&1; then
    echo >&2 "error: failed to connect to MySQL with user $mysql_user"
    exit 1
fi

echo "Generating query..."
awkcommand='{
    printf("INSERT INTO edge_extension (gene_id1, gene_id2, network_id1, network_id2, score, extension_name) VALUES ((SELECT id FROM gene WHERE name = \"%s\"), (SELECT id FROM gene WHERE name = \"%s\"), %d, %d, %f, \"%s\");\n", $1, $3, $2, $4, $5, ext);
}'
query=$(awk -v ext=$name "$awkcommand" $input)

echo "Removing existing extension details..."
delete_output=$(mysql \
    --user=$mysql_user \
    --password=$mysql_pwd \
    --database=$database \
    --execute="DELETE FROM edge_extension WHERE extension_name = \"$name\"" \
    2>&1 || :)
echo $delete_output | grep -v 'Using a password on the command line' || :

echo "Executing query..."
insert_output=$(mysql \
    --user=$mysql_user \
    --password=$mysql_pwd \
    --database=$database \
    < <(printf "$query") 2>&1 || :)
echo $insert_output | grep -v "Using a password on the command line" || :
