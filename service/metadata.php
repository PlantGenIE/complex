<?php

require_once('../db.php');

$method = isset($_POST['method']) ? $_POST['method'] : 'get_networks';

function get_networks() {
    global $db;
    global $config;
    $stmt = $db->prepare('SELECT network.id AS id,
                                 network.name AS name,
                                 species.sciname AS species,
                                 species.shortname AS shortname
                          FROM network
                          LEFT OUTER JOIN species
                              ON network.species_id = species.id
                          WHERE network.name IN ('.prepare_in('network', $config['db']['networks']).')');
    $stmt->execute(build_in_array('network', $config['db']['networks']));
    $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($res);
}

call_user_func($method);

?>
