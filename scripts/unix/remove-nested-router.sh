#!/usr/bin/env bash
# Usage: from the "web" folder run:
#   bash scripts/unix/remove-nested-router.sh src/App.tsx
set -euo pipefail
TARGET="${1:-src/App.tsx}"

if [ ! -f "$TARGET" ]; then
  echo "File not found: $TARGET" >&2
  exit 1
fi

cp "$TARGET" "$TARGET.bak.router"

# Remove BrowserRouter import lines (several forms) and RouterProvider imports;
# Then replace JSX tags with fragments.
# We use awk to keep it portable.
awk '
  BEGIN{IGNORECASE=0}
  {
    line=$0
    # remove default BrowserRouter import
    if (line ~ /^[[:space:]]*import[[:space:]]+BrowserRouter[[:space:]]+from[[:space:]]+["'\'']react-router-dom["'\''];?[[:space:]]*$/) next
    # remove BrowserRouter within named imports and RouterProvider from named imports
    if (line ~ /^[[:space:]]*import[[:space:]]*{[^}]*}[[:space:]]*from[[:space:]]*["'\'']react-router-dom["'\''];?[[:space:]]*$/){
      gsub(/BrowserRouter[[:space:]]*,?[[:space:]]*/,"",line)
      gsub(/RouterProvider[[:space:]]*,?[[:space:]]*/,"",line)
      gsub(/[[:space:]]*,[[:space:]]*}/,"}",line)
      gsub(/{[[:space:]]*}/,"",line)
      if (line ~ /^[[:space:]]*import[[:space:]]*;?[[:space:]]*$/) next
      print line
      next
    }
    # replace tags in JSX later with a post step
    print line
  }
' "$TARGET" \
| sed -E 's/<[[:space:]]*BrowserRouter[[:space:]]*>/<>/g;
          s#</[[:space:]]*BrowserRouter[[:space:]]*>#</>#g;
          s/<[[:space:]]*RouterProvider[^>]*>/<>/g;
          s#</[[:space:]]*RouterProvider[[:space:]]*>#</>#g;' > "$TARGET.tmp"

mv "$TARGET.tmp" "$TARGET"
echo "Patched $TARGET (backup at $TARGET.bak.router)"
