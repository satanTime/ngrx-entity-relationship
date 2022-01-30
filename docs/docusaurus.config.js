module.exports = {
    title: 'ngrx-entity-relationship',
    tagline: 'ORM selectors for redux, @ngrx/entity and @ngrx/data. Ease of relationships with entities.',
    url: 'https://ngrx-entity-relationship.sudo.eu',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'throw',
    onDuplicateRoutes: 'throw',
    baseUrlIssueBanner: false,
    favicon: 'img/favicon.ico',
    organizationName: 'satanTime',
    projectName: 'ngrx-entity-relationship',
    themeConfig: {
        hideableSidebar: true,
        navbar: {
            title: 'ngrx-entity-relationship',
            items: [
                {
                    label: 'Redux StackBlitz',
                    href: 'https://stackblitz.com/edit/ngrx-entity-relationship-react?file=src/MyComponent.tsx',
                    position: 'left',
                },
                {
                    label: 'Redux CodeSandbox',
                    href: 'https://codesandbox.io/s/github/satanTime/ngrx-entity-relationship-react?file=/src/MyComponent.tsx',
                    position: 'left',
                },
                {
                    label: 'NGRX StackBlitz',
                    href: 'https://stackblitz.com/github/satanTime/ngrx-entity-relationship-angular?file=src/app/app.component.ts',
                    position: 'left',
                },
                {
                    label: 'NGRX CodeSandbox',
                    href: 'https://codesandbox.io/s/github/satanTime/ngrx-entity-relationship-angular?file=/src/app/app.component.ts',
                    position: 'left',
                },
                {
                    label: 'GitHub repo',
                    href: 'https://github.com/satanTime/ngrx-entity-relationship',
                    position: 'right',
                },
                {
                    label: 'NPM package',
                    href: 'https://www.npmjs.com/package/ngrx-entity-relationship',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Content',
                    items: [
                        {
                            label: 'Documentation',
                            to: '/',
                        },
                        {
                            label: 'Redux StackBlitz',
                            href: 'https://stackblitz.com/edit/ngrx-entity-relationship-react?file=src/MyComponent.tsx',
                        },
                        {
                            label: 'Redux CodeSandbox',
                            href: 'https://codesandbox.io/s/github/satanTime/ngrx-entity-relationship-react?file=/src/MyComponent.tsx',
                        },
                        {
                            label: 'NGRX StackBlitz',
                            href: 'https://stackblitz.com/github/satanTime/ngrx-entity-relationship-angular?file=src/app/app.component.ts',
                        },
                        {
                            label: 'NGRX CodeSandbox',
                            href: 'https://codesandbox.io/s/github/satanTime/ngrx-entity-relationship-angular?file=/src/app/app.component.ts',
                        },
                    ],
                },
                {
                    title: 'Community',
                    items: [
                        {
                            label: 'Chat on gitter',
                            href: 'https://gitter.im/ngrx-entity-relationship/community',
                        },
                        {
                            label: 'Ask a question about Redux solution',
                            href: 'https://stackoverflow.com/questions/ask?tags=ngrx-entity-relationship%20ngrx%20angular',
                        },
                        {
                            label: 'Ask a question about NGRX solution',
                            href: 'https://stackoverflow.com/questions/ask?tags=ngrx-entity-relationship%20redux%20reactjs',
                        },
                        {
                            label: 'Report an issue on GitHub',
                            href: 'https://github.com/satanTime/ngrx-entity-relationship/issues/new',
                        },
                    ],
                },
                {
                    title: 'Links',
                    items: [
                        {
                            href: 'https://github.com/satanTime/ngrx-entity-relationship',
                            label: 'GitHub repo',
                        },
                        {
                            href: 'https://www.npmjs.com/package/ngrx-entity-relationship',
                            label: 'NPM package',
                        },
                    ],
                },
            ],
            copyright: `Copyright &copy; ${new Date().getFullYear()}. Built with Docusaurus.`,
        },
    },
    themes: [
        [
            '@docusaurus/theme-classic',
            {
                customCss: require.resolve('./src/css/custom.css'),
            },
        ],
    ],
    plugins: [
        [
            '@docusaurus/plugin-content-docs',
            {
                path: 'articles',
                routeBasePath: '/',
                sidebarPath: require.resolve('./sidebars.js'),
                showLastUpdateAuthor: true,
                showLastUpdateTime: true,
                editUrl: 'https://github.com/satanTime/ngrx-entity-relationship/tree/master/docs/',
                remarkPlugins: [[require('@docusaurus/remark-plugin-npm2yarn'), {sync: true}]],
            },
        ],
        '@docusaurus/plugin-sitemap',
        [
            '@docusaurus/plugin-google-gtag',
            {
                trackingID: 'G-5N6FDRBRCW',
            },
        ],
    ],
};
