const path = require('path');

module.exports = {
    '*': filenames => {
        const commands = [];
        const cwd = process.cwd();
        const files = filenames
            .filter(file => !file.match(/\.(ts)$/i))
            .map(file => path.relative(cwd, file))
            .map(file => `'${file}'`);
        if (files.length === 0) {
            return [];
        }

        commands.push(`prettier --write ${files.join(' ')}`);

        return commands;
    },
    '*.ts': filenames => {
        const commands = [];
        const cwd = process.cwd();
        const files = filenames.map(file => path.relative(cwd, file)).map(file => `'${file}'`);
        if (files.length === 0) {
            return [];
        }

        commands.push(`prettier --write ${files.join(' ')}`);
        commands.push(`npm run lint -- --fix --force ${files.join(' ')}`);
        commands.push(`prettier --write ${files.join(' ')}`);
        commands.push(`npm run lint -- ${files.join(' ')}`);

        return commands;
    },
};
