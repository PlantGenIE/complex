#!/bin/bash

set -eu

usage() {
    echo >&2 "usage: $0 GENES NAME DATABASE"
    echo >&2
    echo >&2 "GENES    file with gene names, one per line"
    echo >&2 "NAME     name of extension"
    echo >&2 "DATABASE MySQL database name"
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
    printf("INSERT INTO gene_extension (gene_id, extension_name) VALUES ((SELECT id FROM gene WHERE name = \"%s\"), \"%s\");\n", $1, table)
}'
query=$(awk -v table=$name "$awkcommand" $input)

echo "Removing existing extension details..."
delete_output=$(mysql \
    --user=$mysql_user \
    --password=$mysql_pwd \
    --database=$database \
    --execute="DELETE FROM gene_extension WHERE extension_name = \"${name}\"" \
    2>&1 || :)
echo $delete_output | grep -v "Using a password on the command line" || :

echo "Executing query..."
insert_output=$(mysql \
    --user=$mysql_user \
    --password=$mysql_pwd \
    --database=$database \
    < <(echo $query) 2>&1 || :)
echo $insert_output | grep -v 'Using a password on the command line' || :
