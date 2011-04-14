<h1>Installation</h1>
<p>Bitte geben Sie die Zugangsdaten zur Datenbank an:</p>
<?php 

if (isset($error))
	echo '<div class="error">' . $error . '</div>';

if (empty($this->data)):
	$createTables = true;
else:
	$createTables = $this->data['create_tables'];
endif;

echo '<form method="POST">';

echo $form->input('user');
echo $form->input('password', array('type' => 'password'));
echo $form->input('host');
echo $form->input('database');
echo 'Tabellen erstellen: ' . $form->checkbox('create_tables', array('checked' => $createTables));
echo '<br><br>';
echo $form->end('Weiter');


