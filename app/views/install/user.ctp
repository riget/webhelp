<h1>Daten f&uuml;r den Administrator-User:</h1>

<?php 

if (isset($error))
	echo '<div class="error">' . $error . '</div>';
	
echo '<form method="POST">';

echo $form->input('user');
echo $form->input('password', array('type' => 'password'));

echo $form->end('Weiter');
