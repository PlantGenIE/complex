<?php

require_once('../db.php');

$method = isset($_POST['method']) ? $_POST['method'] : 'get_networks';

function get_networks() {
    global $db;
    $stmt = $db->query('SELECT network.id AS id,
                               network.name AS name,
                               species.sciname AS species,
                               species.shortname AS shortname
                        FROM network
                        LEFT OUTER JOIN species
                            ON network.species_id = species.id'); 
    if (!$stmt) {
        echo 'Query failed';
    }
    $stmt->execute();
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($res);
}

call_user_func($method);

?>
