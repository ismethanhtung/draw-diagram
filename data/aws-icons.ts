
export const awsIcons = {
  ec2: {
    name: 'EC2',
    path: 'M17,2V4H15V2H9V4H7V2H17M19,5V19H5V5H19M21,4H23V10H21V11H23V13H21V14H23V20H21V22H19V20H15V22H9V20H7V22H5V20H3V14H5V13H3V11H5V10H3V4H5V2H9V4H15V2H19V4H21M7,7V9H9V7H7M11,7V9H13V7H11M15,7V9H17V7H15M7,11V13H9V11H7M11,11V13H13V11H11M15,11V13H17V11H15M7,15V17H9V15H7M11,15V17H13V15H11M15,15V17H17V15H15Z',
    viewBox: '0 0 24 24',
    fill: '#FF9900',
    category: 'Compute'
  },
  s3: {
    name: 'S3',
    path: 'M2 9.5l.58-.16a8.55 8.55 0 0 1 4.54 0L12 11l-3 1-8.42-2.34A1 1 0 0 1 2 9.5zm9-1.32L5 6l2.16-.54a16.27 16.27 0 0 1 8.84 0L19 6l-6 2.18zM12 2l2.67.67a21.49 21.49 0 0 1 8.75 4 .5.5 0 0 1 .16.66l-2.07 3.73A8.45 8.45 0 0 1 12 14.12a8.45 8.45 0 0 1-9.51-3.06l-2-3.73a.5.5 0 0 1 .16-.66A21.49 21.49 0 0 1 12 2zM3 13.91l6.19 1.76a4 4 0 0 0 2.22 0L21 13.91l-1 2.33a8.67 8.67 0 0 1-5.74 4.5L12 21.5l-2.26-.76a8.67 8.67 0 0 1-5.74-4.5z',
    viewBox: '0 0 24 24',
    fill: '#569A31',
    category: 'Storage'
  },
  lambda: {
    name: 'Lambda',
    path: 'M11.5,2C11.6,2 11.69,2 11.77,2.05L21.78,7.05C21.92,7.12 22,7.26 22,7.41V16.59C22,16.74 21.92,16.88 21.78,16.95L11.78,21.95C11.69,22 11.6,22 11.5,22C11.4,22 11.31,22 11.23,21.95L1.23,16.95C1.08,16.88 1,16.74 1,16.59V7.41C1,7.26 1.08,7.12 1.23,7.05L11.23,2.05C11.31,2 11.4,2 11.5,2M12,11.38V12L15.36,18H18.78L14.28,10.2L12,11.38M7,18H10.74L15.54,9.5L11.54,7.28L7,18Z',
    viewBox: '0 0 24 24',
    fill: '#FF9900',
    category: 'Compute'
  },
  rds: {
    name: 'RDS',
    path: 'M7,3H17V5H19V7H21V9H23V11H21V13H23V15H21V17H19V19H17V21H7V19H5V17H3V15H1V13H3V11H1V9H3V7H5V5H7M9,5V7H15V5M9,9V11H15V9M9,13V15H15V13M9,17V19H15V17',
    viewBox: '0 0 24 24',
    fill: '#3B48CC',
    category: 'Database'
  },
  dynamodb: {
    name: 'DynamoDB',
    path: 'M4 18l8 4.5L20 18l-8-3.72zm0-5l8 3.75 8-3.75-8-4.5zm0-5l8 3.75 8-3.75L12 2.5z',
    viewBox: '0 0 24 24',
    fill: '#3B48CC',
    category: 'Database'
  },
  apigateway: {
    name: 'API Gateway', 
    path: 'M2 7h20v10H2V7zm2 2v6h16V9H4zm6 1h4v4h-4v-4z',
    viewBox: '0 0 24 24',
    fill: '#A020F0',
    category: 'Networking'
  },
  vpc: {
    name: 'VPC',
    path: 'M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M7,10L12,15L17,10H7Z',
    viewBox: '0 0 24 24',
    fill: '#3B48CC',
    category: 'Networking'
  },
  iam: {
    name: 'IAM',
    path: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
    viewBox: '0 0 24 24',
    fill: '#CC2264',
    category: 'Security'
  },
  cloudwatch: {
    name: 'CloudWatch',
    path: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z',
    viewBox: '0 0 24 24',
    fill: '#CC2264',
    category: 'Management'
  },
  cloudfront: {
    name: 'CloudFront',
    path: 'M12,2L2,12L12,22L22,12L12,2M12,6L18,12L12,18L6,12L12,6Z',
    viewBox: '0 0 24 24',
    fill: '#A020F0',
    category: 'Networking'
  },

  // Common extra services (simple placeholders until official SVG set is added)
  ecs: {
    name: 'ECS',
    path: 'M4 6h16v12H4V6zm2 2v8h12V8H6zm3 1h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z',
    viewBox: '0 0 24 24',
    fill: '#FF9900',
    category: 'Compute'
  },
  ecr: {
    name: 'ECR',
    path: 'M6 4h12v4H6V4zm0 6h12v10H6V10zm2 2v6h8v-6H8z',
    viewBox: '0 0 24 24',
    fill: '#FF9900',
    category: 'Compute'
  },
  eks: {
    name: 'EKS',
    path: 'M12 2l9 5v10l-9 5-9-5V7l9-5zm-5 7h10v6H7V9zm2 2v2h2v-2H9zm4 0v2h2v-2h-2z',
    viewBox: '0 0 24 24',
    fill: '#FF9900',
    category: 'Compute'
  },
  elb: {
    name: 'ELB',
    path: 'M4 6h16v4H4V6zm2 6h12v6H6v-6zm2 1v4h8v-4H8z',
    viewBox: '0 0 24 24',
    fill: '#3B48CC',
    category: 'Networking'
  },
  route53: {
    name: 'Route 53',
    path: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16zm-5 8h10v2H7v-2z',
    viewBox: '0 0 24 24',
    fill: '#3B48CC',
    category: 'Networking'
  },
  sns: {
    name: 'SNS',
    path: 'M4 6h16v12H4V6zm2 2v8h12V8H6zm3 1l6 3-6 3V9z',
    viewBox: '0 0 24 24',
    fill: '#A020F0',
    category: 'Application'
  },
  sqs: {
    name: 'SQS',
    path: 'M5 6h14v12H5V6zm2 2v2h10V8H7zm0 4v2h10v-2H7z',
    viewBox: '0 0 24 24',
    fill: '#A020F0',
    category: 'Application'
  },
  stepfunctions: {
    name: 'Step Functions',
    path: 'M6 5h12v14H6V5zm2 2v10h8V7H8zm2 1h4v2h-4V8zm0 4h4v2h-4v-2z',
    viewBox: '0 0 24 24',
    fill: '#A020F0',
    category: 'Application'
  },
  cloudtrail: {
    name: 'CloudTrail',
    path: 'M12 2l8 5v10l-8 5-8-5V7l8-5zm-3 7h6v2H9V9zm0 4h6v2H9v-2z',
    viewBox: '0 0 24 24',
    fill: '#CC2264',
    category: 'Management'
  },
  kms: {
    name: 'KMS',
    path: 'M12 2a7 7 0 017 7v2h1v4h-1v2a7 7 0 11-14 0v-2H4v-4h1V9a7 7 0 017-7zm-5 9h10V9a5 5 0 10-10 0v2z',
    viewBox: '0 0 24 24',
    fill: '#CC2264',
    category: 'Security'
  },
  cloudformation: {
    name: 'CloudFormation',
    path: 'M6 4h12v16H6V4zm2 2v12h8V6H8zm2 2h4v2h-4V8zm0 4h4v2h-4v-2z',
    viewBox: '0 0 24 24',
    fill: '#CC2264',
    category: 'Management'
  },
  ebs: {
    name: 'EBS',
    path: 'M7 4h10v16H7V4zm2 2v12h6V6H9z',
    viewBox: '0 0 24 24',
    fill: '#569A31',
    category: 'Storage'
  },
  efs: {
    name: 'EFS',
    path: 'M6 6h12v12H6V6zm2 2v8h8V8H8zm1 1h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z',
    viewBox: '0 0 24 24',
    fill: '#569A31',
    category: 'Storage'
  },
  redshift: {
    name: 'Redshift',
    path: 'M6 6h12v12H6V6zm2 2v8h8V8H8zm3 1h2v6h-2V9z',
    viewBox: '0 0 24 24',
    fill: '#3B48CC',
    category: 'Database'
  }
};

export type AwsIconType = keyof typeof awsIcons;
