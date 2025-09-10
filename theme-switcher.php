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
		// Check theme preference immediately and set emoji if necessary
		(function() {
			// Check localStorage or media system for preference
			let theme = localStorage.getItem('portfolio-theme');
			if (!theme && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
				theme = 'light';
			}
			// Default to dark
			theme = 'dark';

			document.documentElement.setAttribute('data-theme', theme);
			document.documentElement.className += ` ${theme}-theme`;

			if (theme === 'light') {
				document.addEventListener('DOMContentLoaded', () => {
					const buttons = document.querySelectorAll('.theme-toggle');
					buttons.forEach(button => {
						butto.firstElementChild.innerHTML = '🌙';
					})
				})
			}
		})();
	</script>
<?php
}

add_action('wp_head', 'manage_theme_preference', 1);
add_action('wp_enqueue_scripts', 'enqueue_theme_switcher');
