<?php

/**
 * Plugin name: Theme Switcher
 * Description: JavaScript-powered theme switcher that hooks into existing buttons
 * Version: 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH'))
	exit;

function enqueue_theme_switcher()
{
	wp_enqueue_script(
		'portfolio-theme-switcher',
		plugin_dir_url(__FILE__) . 'theme-switcher.js',
		array(),
		'1.0.0',
		true
	);

	wp_enqueue_style(
		'theme-switcher-css',
		plugin_dir_url(__FILE__) . 'style.css',
		array(),
		'1.0.0'
	);
}

function manage_theme_preference()
{
?>
	<script>
		// Check theme preference immeidately
		(function() {
			let theme = localStorage.getItem('portfolio-theme') || 'light';
			document.documentElement.setAttribute('data-theme', theme);
			document.body.setAttribute('data-theme', theme);
			document.documentElement.className += ' theme-' + theme;
			document.body.className += ' theme-' + theme;
		})();
	</script>
<?php
}

add_action('wp_head', 'manage_theme_preference', 1);
add_action('wp_enqueue_scripts', 'enqueue_theme_switcher');
