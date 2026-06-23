# Changelog

All notable changes to the Anon Clubhouse Application will be documented in
this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.3.0] - 2026-06-23

### Added

- Included route protection on routes (member or registered user protection) which
  prevents user without necessary access rights from viewing the page
- Enhanced profile and index page views to showcase user that is logged in or not

### Changed

- Improved post feeds post author display name depending on user right and post
  author

---

## [0.2.1] - 2026-06-22

### Added

- Added demo regular user path to allow user view what a regular user will see
  without having to register

---

## [0.2.0] - 2026-06-20

### Added

- Added user authentication and session storage
- Ensured user can login, register, proceed as guest or view demo accounts
  (as admin or as a clubhouse member)
- Configured tailwindCSS/cli as the css framework to be used in project

---

## [0.1.0] - 2026-06-12

### Added

- Added starter templating content for all necessary page routes
- Added server configurations for each page route
