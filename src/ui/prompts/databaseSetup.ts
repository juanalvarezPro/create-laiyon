import chalk from "chalk";

export const DATABASE_CHOICES = [
    {
        name: `${chalk.green("💾")} Memory`,
        value: "base-ts-wasapi-memory"
    },
    {
        name: `${chalk.blue("📄")} JSON`,
        value: "base-ts-wasapi-json",
    },
    {
        name: `${chalk.yellow("🐬")} MySQL (beta)`,
        value: "base-ts-wasapi-mysql"
    },
    {
        name: `${chalk.cyan("🍃")} MongoDB`,
        value: "base-ts-wasapi-mongo",
        disabled: chalk.gray("(Coming Soon)")
    },
    {
        name: `${chalk.magenta("🐘")} PostgreSQL`,
        value: "base-ts-wasapi-postgresql",
        disabled: chalk.gray("(Coming Soon)")
    }
];

// Database question
export const DATABASE_QUESTION = {
    type: "list",
    name: "dbType",
    message: chalk.blue("🗄️ Database:"),
    choices: DATABASE_CHOICES,
    default: "base-ts-wasapi-memory"
} as const;