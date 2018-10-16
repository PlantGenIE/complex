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

genes="$1"
name="$2"
database="$3"

read -p "MySQL user: " mysql_user
read -sp "MySQL password: " mysql_pwd
echo

while read line; do
    gene1=$(awk '{print $1}' <(echo $line))
    network1=$(awk '{print $2}' <(echo $line))
    gene2=$(awk '{print $3}' <(echo $line))
    network2=$(awk '{print $4}' <(echo $line))
    score=$(awk '{print $5}' <(echo $line))
    query="INSERT IGNORE INTO edge_extension (gene_id1, gene_id2, network_id1, network_id2, score, extension_name) VALUES ((SELECT id FROM gene WHERE name = '$gene1'), (SELECT id FROM gene WHERE name = '$gene2'), $network1, $network2, $score, '$name');"
    output=$(mysql \
        --user=$mysql_user \
        --password=$mysql_pwd \
        --database=$database \
        --execute="$query" 2>&1) || true
    if grep --quiet 'ERROR' <(echo $output); then
        echo >&2 $output
        exit
    fi
    echo $query
    grep -v 'Using a password on the command line' <(echo $output) || true
done < $genes
