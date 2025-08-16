bun x convex export --prod --path prod_backup.zip

bun x convex import --replace prod_backup.zip

rm prod_backup.zip

echo "Dev environment refreshed from production snapshot"