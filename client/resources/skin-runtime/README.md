# ARAMGG skin runtime

This directory contains the distributable CSLOL `mod-tools.exe` compatibility
layer used by the local skin runtime. Its GPL license is kept in
`LICENSE-CSLOL.txt`. The orchestration flow was adapted from
[Alban1911/Rose](https://github.com/Alban1911/Rose); its MIT license is kept in
`LICENSE-Rose.txt`.

`cslol-dll.dll` is intentionally not bundled. On Windows, users must import
their own compatible runtime file from the Skin Center. ARAMGG copies it to the
application data directory and never uploads it.

Skin archives are downloaded on demand from
[Alban1911/LeagueSkins](https://github.com/Alban1911/LeagueSkins) and cached in
the application data directory. Interrupted downloads keep a `.part` file and
resume on the next attempt.
