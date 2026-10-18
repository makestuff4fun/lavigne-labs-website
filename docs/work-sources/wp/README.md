# Original WordPress text

Public project text recovered from Brian's original WordPress database dumps (exported 2026-10-18):

- `lavignelabs_wp.sql` (main site) — source of all 12 files here.
- `lavignel_wordpress.sql` (second, older site) — checked; it holds only pages, contact forms and form submissions, no project posts, so nothing was taken from it.

The dumps are private (user rows, emails, password hashes) and are not in the repo. Only the project text, title, date and image filenames below were extracted.

## Parse method

A throwaway Python script (kept in /tmp, not committed) read the `INSERT` statements of `wp_posts` and `wp_postmeta` with a hand-rolled SQL tuple parser; no database was started or touched.

- The 8 `portfolio` items keep their text in the `portfolio_info` post meta (their `post_content` is empty); the 4 articles (`post`) use `post_content`.
- HTML/Gutenberg markup was converted to Markdown (headings, bold, lists kept; block comments, theme shortcodes and links dropped, link text kept).
- Posts were matched to slugs by title. WP post ids: 1438 microscope, 1509 micropython, 1248 camera arm, 1311 keyboard, 1330 plotter, 1176 hex puck, 1416 leashes, 1337 sokoban, 1646 PCB artwork, 1679 badge, 1696 badge layout, 1716 8080 LCD.
- `excerpt` is empty for every post in the dump. `featured` is the `_thumbnail_id` attachment filename. `images` also lists `dfiFeatured` slider images, attachments whose `post_parent` is the post, and uploads referenced by `<img>` in the body, as filenames from the attachment guid (including WP resized variants).

Schema: `{slug, wpTitle, wpPostId, text, excerpt, date, featured, images}`. `docs/work-sources/DISCREPANCIES.md` lists where WP and Wayback differ; `IMAGES-NOT-FOUND.md` lists image filenames not found on OneDrive.
