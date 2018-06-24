<?php
ini_set('max_execution_time', 500);
require_once("../db.php");
require("array_column.php");
$execution_time = microtime(true);

if ($tmp_op == 'expand'){
    try {
        $in_params = build_in_array('name', $gsel1);
        $gene_id_stmt = $db->prepare('SELECT id FROM gene WHERE name IN ('.implode(",", array_keys($in_params)).')');
        $gene_id_stmt->execute($in_params);
        $expand_from_id = $gene_id_stmt->fetchAll(PDO::FETCH_COLUMN);
    } catch (PDOException $e) {
        echo "Query failed: ".$e->getMessage();
    }

    try {
        $a_params = build_in_array('gene_id', $expand_from_id);
        $a_query = 'SELECT gene_id1, gene_id2 FROM network_score
            WHERE network_id = :network_id
                AND score > :th
                AND (gene_id1 IN ('.implode(',', array_keys($a_params)).')
                    OR gene_id2 IN ('.implode(',', array_keys($a_params)).'))';
        $a_stmt = $db->prepare($a_query);
        $a_stmt->execute(array_merge(
            array(
                ':network_id' => $tmp_sp1,
                ':th' => $tmp_th1,
                ':gene_id' => $expand_from_id
            ), $a_params));
    } catch (PDOException $e) {
        echo 'Query failed: '.$e->getMessage();
    }

    $a_array = array();
    $a_array1 = array();
    while ($a_row = $a_stmt->fetch(PDO::FETCH_NUM)) {
        $a_array[] = $a_row[0];
        $a_array1[] = $a_row[1];
    }

    if (count($a_array) === 0) {
        echo json_encode(array('msc' => $execution_time));
        exit();
    } else if (count($a_array) > 200) {
        echo 'overflow';
        exit();
    }
    $a_array2 = array_merge($a_array, $a_array1);
    $a_array_string = implode(',', array_values(array_unique($a_array2)));
}

if ($tmp_op == 'expand') {
    $first_query = 'SELECT id, name FROM gene WHERE id in('.$a_array_string.') OR name IN ('.$gstr1.')';
} else {
    $first_query = 'SELECT id, name FROM gene WHERE name in('.$gstr1.')';
}

$first_query_stmt = $db->query($first_query);
$first_query_stmt->execute();

$network1_genes = array();
while ($row = $first_query_stmt->fetch(PDO::FETCH_ASSOC)) {
    $network1_genes[] = array(
        'id' => $row['id'],
        'label' => $row['name']
    );
}

$network1_gene_ids = array_column2($network1_genes, 'id');
$network1_gene_ids_string = implode(',', array_values(array_unique($network1_gene_ids)));

if ($tmp_showN == 'align') {
        $second_query = 'SELECT gene_id1, gene_id2 FROM conservation
            WHERE gene_id1 IN ('.$network1_gene_ids_string.')
            AND type = "conserved"
            AND network_id1 = '.$tmp_sp1.' AND network_id2 = '.$tmp_sp2;
} else {
        $second_query = 'SELECT gene_id1, gene_id2 FROM conservation
            WHERE gene_id1 IN ('.$network1_gene_ids_string.')
            AND gene_id2 IN (SELECT id FROM gene WHERE name IN ('.$gstr2.'))
            AND type = "conserved"
            AND network_id1 = '.$tmp_sp1.' AND network_id2 = '.$tmp_sp2;
}

try {
    $second_query_stmt = $db->query($second_query);
    $second_query_stmt->execute();
} catch (PDOException $e) {
    echo 'Query failed: '.$e->getMessage();
    exit;
}

$conservation = array();
while (list($gene_id1, $gene_id2) = $second_query_stmt->fetch(PDO::FETCH_NUM)) {
    $conservation[] = array(
        'links' => $gene_id1.'-'.$gene_id2,
        'sp2' => $gene_id2,
        $gene_id1 => $gene_id2,
        $gene_id2.'second' => $gene_id1
    );
}
$conservation_links = array_column2($conservation, 'links');
$conservation_links_string = implode(',', array_values(array_unique($conservation_links)));

$network2_gene_ids = array_column2($conservation, 'sp2');
$network2_gene_ids = array_values(array_unique($network2_gene_ids));
$network2_gene_ids_string = implode(',', $network2_gene_ids);

$forth_query = 'SELECT gene_id1, gene_id2, score
                FROM network_score
                WHERE network_id = '.$tmp_sp1.'
                    AND gene_id1 IN ('.$network1_gene_ids_string.')
                    AND gene_id2 IN ('.$network1_gene_ids_string.')
                    AND score > '.$tmp_th1;
$forth_query_stmt = $db->query($forth_query);
if (!$forth_query_stmt) {
    echo 'Network 1 edge query failed: '.$forth_query;
    exit;
}
$forth_query_stmt->execute();

$network1 = array();
while (list($i11, $i12, $corr) = $forth_query_stmt->fetch(PDO::FETCH_NUM)){
    $network1[] = array(
        'id' => $i11.'-'.$i12,
        'corr' => $corr,
        'src' => $i11,
        'trgt' => $i12
    );
}

$fifth_query = 'SELECT gene_id1, gene_id2, score
    FROM network_score
    WHERE network_id = '.$tmp_sp2.'
        AND gene_id1 IN ('.$network2_gene_ids_string.')
        AND gene_id2 IN ('.$network2_gene_ids_string.')
        AND score > '.$tmp_th2;
$fifth_query_stmt = $db->query($fifth_query);
if (!$fifth_query_stmt) {
    echo 'Network 2 edge query failed: '.$fifth_query;
    exit;
}
$fifth_query_stmt->execute();

$network2 = array();
while (list($i21, $i22, $corr) = $fifth_query_stmt->fetch(PDO::FETCH_NUM)) {
    $network2[] = array(
        'id' => $i21.'-'.$i22,
        'src' => $i21,
        'trgt' => $i22,
        'corr' => $corr
    );
}

$sixth_query = 'SELECT id, name FROM gene WHERE id IN ('.$network2_gene_ids_string.')';
$sixth_query_stmt = $db->query($sixth_query);
if (!$sixth_query_stmt) {
    echo 'Query failed: '.$sixth_query;
    exit;
}

$network2_genes = array();
while (list($sp2_i, $sp2_id) = $sixth_query_stmt->fetch(PDO::FETCH_NUM)) {
    $network2_genes[] = array(
        'id' => $sp2_i,
        'label' => $sp2_id
    );
}

$execution_time = microtime(true) - $execution_time;

$network1_out = array();
foreach ($network1_genes as $gene) {
    $network1_out[] = array(
        'group' => 'nodes',
        'data' => array(
            'id' => (int)$gene['id'],
            'label' => $gene['label']
        )
    );
}

foreach ($network1 as $edge) {
    $network1_out[] = array(
        'group' => 'edges',
        'data' => array(
            'source' => (int)$edge['src'],
            'target' => (int)$edge['trgt'],
            'weight' => (double)$edge['corr']
        )
    );
}

$network2_out = array();
foreach ($network2_genes as $gene) {
    $network2_out[] = array(
        'group' => 'nodes',
        'data' => array(
            'id' => (int)$gene['id'],
            'label' => $gene['label']
        )
    );
}

foreach ($network2 as $edge) {
    $network2_out[] = array(
        'group' => 'edges',
        'data' => array(
            'source' => (int)$edge['src'],
            'target' => (int)$edge['trgt'],
            'weight' => (double)$edge['corr']
        )
    );
}

echo json_encode(array(
    'network1' => array('id' => $tmp_sp1, 'network' => $network1_out),
    'network2' => array('id' => $tmp_sp2, 'network' => $network2_out),
    'execution_time' => $execution_time
));
