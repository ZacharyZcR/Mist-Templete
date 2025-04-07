// eslint.config.js
import js from '@eslint/js';
import vuePlugin from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';

export default [
    js.configs.recommended,
    {
        files: ['**/*.vue'],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                ecmaVersion: 2023,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true
                }
            },
            globals: {
                process: 'readonly'
            }
        },
        plugins: {
            vue: vuePlugin
        },
        rules: {
            // Vue规则
            'vue/multi-word-component-names': 'off',
            'vue/html-self-closing': 'off',
            'vue/max-attributes-per-line': 'off'
        }
    },
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2023,
            sourceType: 'module',
            globals: {
                process: 'readonly'
            }
        },
        rules: {
            // 简化问题，直接关闭这两个规则
            'no-console': 'off',
            'no-debugger': 'off'
        }
    }
];