#!/usr/bin/env bash
node --trace_gc --trace_gc_nvp --trace_gc_verbose example/index.js | node ./bin/onegc