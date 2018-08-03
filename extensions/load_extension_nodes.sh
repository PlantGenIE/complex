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

genes="$1"
name="$2"
database="$3"

read -p "MySQL user: " mysql_user
read -sp "MySQL password: " mysql_pwd
echo

while read line; do
    gene=$(awk '{print $1}' <(echo $line))
    query="INSERT IGNORE INTO gene_extension (gene_id, extension_name) VALUES ((SELECT id FROM gene WHERE name = '$gene'), '$name');"
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
