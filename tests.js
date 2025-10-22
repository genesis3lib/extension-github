/**
 * Genesis3 Module Test Configuration - GitHub Extension
 */

module.exports = {
  moduleId: 'extension-github',
  moduleName: 'GitHub CI/CD & Actions',

  scenarios: [
    {
      name: 'github-actions-basic',
      description: 'Basic GitHub Actions CI/CD',
      config: {
        moduleId: 'gh-ci',
        kind: 'extension',
        type: 'github',
        layers: ['ops'],
        enabled: true,
        fieldValues: {
          enableActions: true,
          enableDependabot: false,
          enableCodeScanning: false
        }
      },
      expectedFiles: [
        '.github/workflows/ci.yml'
      ]
    },
    {
      name: 'github-full-security',
      description: 'GitHub with full security suite',
      config: {
        moduleId: 'gh-secure',
        kind: 'extension',
        type: 'github',
        layers: ['ops'],
        enabled: true,
        fieldValues: {
          enableActions: true,
          enableDependabot: true,
          enableCodeScanning: true,
          enableSecretScanning: true
        }
      },
      expectedFiles: [
        '.github/workflows/ci.yml',
        '.github/dependabot.yml',
        '.github/workflows/codeql.yml'
      ]
    },
    {
      name: 'github-multi-env-deploy',
      description: 'GitHub Actions with multi-environment deployment',
      config: {
        moduleId: 'gh-deploy',
        kind: 'extension',
        type: 'github',
        layers: ['ops'],
        enabled: true,
        fieldValues: {
          enableActions: true,
          enableDeployment: true,
          deployEnvironments: ['dev', 'staging', 'prod'],
          enableAutoMerge: false
        }
      },
      expectedFiles: [
        '.github/workflows/ci.yml',
        '.github/workflows/deploy-dev.yml',
        '.github/workflows/deploy-staging.yml',
        '.github/workflows/deploy-prod.yml'
      ]
    }
  ]
};
