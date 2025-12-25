/**
 * Genesis3 Module Test Configuration - GitHub Extension
 *
 * Tests for GitHub CI/CD workflows including Terraform state management,
 * security features, and deployment pipelines.
 */

module.exports = {
  moduleId: 'vcs-github',
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
  ],

  /**
   * Template validations for CI/CD workflow files
   * These validate that workflow templates contain correct recovery and security patterns
   */
  templateValidations: [
    {
      name: 'state-corruption-recovery',
      description: 'P0: Terraform apply workflow must detect and recover from state corruption',
      template: 'cicd/.github/workflows/Appinfra-030-apply.yml.mustache',
      contains: [
        'state data in S3 does not have the expected content',
        'State corruption detected',
        '-reconfigure',
        'attempting recovery'
      ]
    },
    {
      name: 'dynamodb-lock-clearing',
      description: 'P1: Bootstrap workflow must clear stale DynamoDB locks',
      template: 'cicd/.github/workflows/Appinfra-020-bootstrap.yml.mustache',
      contains: [
        'Clear DynamoDB Locks',
        'dynamodb scan',
        'dynamodb delete-item',
        'Cleared all locks'
      ]
    },
    {
      name: 'ssh-key-generation',
      description: 'P1: Apply workflow must generate SSH keys if missing',
      template: 'cicd/.github/workflows/Appinfra-030-apply.yml.mustache',
      contains: [
        'Check and Generate SSH Keys',
        'ssh-keygen -t rsa -b 4096',
        's3 cp'
      ]
    },
    {
      name: 'bootstrap-import-fallback',
      description: 'P1: Bootstrap workflow must handle existing resources via terraform import',
      template: 'cicd/.github/workflows/Appinfra-020-bootstrap.yml.mustache',
      contains: [
        'BucketAlreadyOwnedByYou',
        'terraform import',
        'attempting to import'
      ]
    },
    {
      name: 'oidc-authentication',
      description: 'P1: Workflows must use OIDC for AWS authentication',
      template: 'cicd/.github/actions/aws-credentials/action.yml.mustache',
      contains: [
        'id-token: write',
        'aws-actions/configure-aws-credentials',
        'role-to-assume'
      ]
    },
    {
      name: 'deployment-summary',
      description: 'P2: Workflows must include deployment summary in GITHUB_STEP_SUMMARY',
      template: 'cicd/.github/workflows/Appinfra-030-apply.yml.mustache',
      contains: [
        'GITHUB_STEP_SUMMARY',
        'Deployment Summary',
        'Deployment Successful'
      ]
    }
  ]
};
