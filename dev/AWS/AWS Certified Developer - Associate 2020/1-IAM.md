# Identity and Access Management

- Manage users and their level of access to the AWS console
- Global - apply to all regions

1. Centralised control of AWS accounts
2. Shared access to AWS account
3. Granular permissions
4. Identity federation - support well known identity providers

## Definitions

- Users - people
- Groups - collection of users in one set of permissions
- Roles - define sets of permissions for users/services that do not have access to current AWS resources. Must be *assumed* by a user or a service. Eg assigning role to EC2 instance to access S3
- Policy - document defines >= 1 permissions attached to user, group, or roles

- Access key and secret access key -> log on CLI

- Explicit `Deny` will always override any `Allow`. All permissions are implicitly `Deny`

## IAM Policy Simulator

- Validate policy before production
- Test already attached policy

## Summary

- Roles, users, and groups
- Policy - document defines permissions
- Create user accounts (no permission when created)
  - Access Key and secret key used to access AWS via API and CLI
  - User and password for console log in
  - Can only download secret key when first created
- Set up MFA on root account
- Set password rotation policies
