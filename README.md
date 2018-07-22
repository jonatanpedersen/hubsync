# hubsync

Clones/pulls all personal and organization repositories.

[![Build Status](https://travis-ci.org/jonatanpedersen/hubsync.svg?branch=master)](https://travis-ci.org/jonatanpedersen/hubsync)


## Install

``` bash
npm i hubsync -g
```

## Usage

``` bash
$ hubsync -t [personal access token] -d [working directory]

  hubsync Clone jonatanpedersen/hubsync (pushed 32 minutes ago) +0ms
  hubsync Clone jonatanpedersen/jambon (pushed an hour ago) +8ms

```

### Help

``` bash
$ hubsync --help

hubsync

  Clones/pulls all personal and organization repositories.

Options

  -t, --token string         Personal access token for GitHub. Defaults to $HUBSYNC_TOKEN.
  -c, --concurrency number   Concurrent child processes. Defaults to 10.
  -d, --cwd string           Working directory. Defaults to current working directory.
  -h, --help                 Print this usage guide.

  GitHub: https://github.com/jonatanpedersen/hubsync

```

## Debug

hubsync is using the `debug` module to provide debug information:

``` bash
export DEBUG=hubsync
export DEBUG_COLORS=1
```

## Licence

The MIT License (MIT)

Copyright (c) 2018 [Jonatan Pedersen](https://www.jonatanpedersen.com/)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
