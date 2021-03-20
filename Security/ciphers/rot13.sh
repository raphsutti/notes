#!/bin/bash
# Usage ./rot13.sh [cipher text]
echo "$1" | tr 'a-zA-Z' 'n-za-mN-ZA-M'