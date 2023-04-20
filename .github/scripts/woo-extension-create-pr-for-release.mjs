/**
 * Internal dependencies
 */
// import PackageTool from '../../packages/js/github-actions/utils/package-tool.js';

export default async ( { github, context, repository, base, refName, type, version, wp_version, wc_version } ) => {
	// const packageTool = new PackageTool( 'packages/js/github-actions' );
	// const { heading, content } = packageTool.getChangelogByVersion( version );

	// Build repo URL. We cannot use `github.repository_url` as WooRelease expects HTTP…`/tree` one.
	const repoURL = 'https://github.com/' + repository + '/tree/' + type + '/' + version;
	// Assume extension package is called as the repo.
	const extensionPackageName = JSON.stringify( context.payload );// github.repository.split('/')[1];

	let tested_versions =
		( wp_version ? ' --wp_tested=' + wp_version : '' ) +
		( wc_version ? ' --wc_tested=' + wc_version : '' );

	const title = `${ type } ${ version }`;
	const body = `## Checks
- [ ] Double-check that base and target branches are as you desire.
- [ ] \`woorelease simulate --product_version=${ version } ${ tested_versions } --generate_changelog ${ repoURL }\` (to be automated)
- [ ] The changelog is correct. If not, update the referenced PR's label, or be prepared to edit it manually in the \`woorelease release\` step.
- [ ] Test package
   - [ ] Install \`/tmp/${ extensionPackageName }.zip\` file on a test site
   - [ ] Confirm it activates without warnings/errors and is showing the right versions
   - [ ] Run a few basic smoke tests
- [ ] \`woorelease release --product_version=${ version } ${ tested_versions }  --generate_changelog ${ repoURL }\` (to be automated)

## Next steps
1. ~Approve this PR to allow [the next workflow creates a new release](https://github.com/woocommerce/grow/actions/workflows/github-actions-create-release.yml).~
1. Another workflow will pick up the new release and post a comment here with the GitHub's release notes.
1. Merge this PR after the new release is successfully created and the version tags are updated.

---
Changelog goes here`;

	await github.rest.pulls.create( {
		...context.repo,
		base,
		head: refName,
		title,
		body,
	} );
};
