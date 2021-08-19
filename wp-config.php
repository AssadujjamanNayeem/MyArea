<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */
// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'newmyarea' );
/** MySQL database username */
define( 'DB_USER', 'root' );
/** MySQL database password */
define( 'DB_PASSWORD', '' );
/** MySQL hostname */
define( 'DB_HOST', 'localhost' );
/** Database Charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );
/** The Database Collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );
/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'ducbuxqria8ww4vbily7extzsqsrcmnylw5k62djiafgyx4pexxoclcqw1lojhes' );
define( 'SECURE_AUTH_KEY',  'kbcrlwhh81ojtgp4xc4stnfwwxfiqvkp7qjyorbrp3pphfxlju9gua443khzc1gl' );
define( 'LOGGED_IN_KEY',    '5nnttaau9trabtauodmmmgqr5zjj6recfhnzg2shcoenpo3vwuiqezh92qjilmoz' );
define( 'NONCE_KEY',        '7ob4vboptxidl1ke6ynqaicx7sjqjqmkyuxyvbuzvdwflpvuapguwrx8ugzqcohh' );
define( 'AUTH_SALT',        'xyfpnqdfq9ytms9q0yqtkuv7kfoynkh8oxpzssqcgg0mk6m8mu7nbuvhsmtwwuzb' );
define( 'SECURE_AUTH_SALT', 'eirgy5ut0iripwg5oiykzvxixsfvkmcft4xbstqsrdjwiigfz6szkyuiozw5ay4u' );
define( 'LOGGED_IN_SALT',   'oqz1tome8b4zpglqzb6b1yhfp0cq2becihtuizoptjknrxi7rmlye9iv0yi4smpc' );
define( 'NONCE_SALT',       '83n5gtpydfnng87zsbdawtuxflxzsal5urgnbv0nwg8jrudmqs6x4xuelplfsuyb' );
/**#@-*/
/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
define('WP_MEMORY_LIMIT', '256M');
$table_prefix = 'wpx9_';
/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );
/* That's all, stop editing! Happy publishing. */
/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}
/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
