#!/usr/bin/env node

const fs = require('fs')
const readline = require('readline')

const originalDescription = 'description-of-project-goes-here'
const originalNamespace = 'ffc-demo'
const originalProjectName = 'starter-node-repo'

function processInput (args) {
  const [, , projectName, description] = args
  if (args.length === 2) {
    console.error('Please enter a new name and description for the project e.g. my-new-repo "CLI for saving me time".')
    process.exit(1)
  }
  if (args.length !== 4 || !projectName || !description) {
    const errMsg = [
      'Please enter a new name and description for the project.',
      'The description must not be empty and be wrapped in quotation marks e.g. "best description ever".'
    ]
    console.error(errMsg.join('\n'))
    process.exit(1)
  }
  return { description, projectName }
}

async function confirmRename (projectName, description) {
  const affirmativeAnswer = 'yes'
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  return new Promise((resolve, reject) => {
    rl.question(`Do you want to rename the project to '${projectName}', with a description of '${description}'?\nType '${affirmativeAnswer}' to confirm\n`, (answer) => {
      rl.close()
      resolve(answer === affirmativeAnswer)
    })
  })
}

function getScriptDir () {
  return './scripts'
}

function getRootFiles () {
  return ['docker-compose.yaml', 'docker-compose.override.yaml', 'docker-compose.test.yaml', 'docker-compose.test.watch.yaml', 'package.json', 'package-lock.json']
}

function getScriptFiles () {
  const scriptDir = getScriptDir()
  const files = ['test']
  return files.map((file) => {
    return `${scriptDir}/${file}`
  })
}

function getNamespace (projectName) {
  const firstIndex = projectName.indexOf('-')
  const secondIndex = projectName.indexOf('-', firstIndex + 1)
  return projectName.substring(0, secondIndex)
}

async function updateProjectName (projectName) {
  const rootFiles = getRootFiles()
  const scriptFiles = getScriptFiles()
  const filesToUpdate = [...rootFiles, ...scriptFiles]
  const namespace = getNamespace(projectName)

  console.log(`Updating projectName from '${originalProjectName}', to '${projectName}'. In...`)
  await Promise.all(filesToUpdate.map(async (file) => {
    console.log(file)
    try {
      const content = await fs.promises.readFile(file, 'utf8')
      const projectNameRegex = new RegExp(originalProjectName, 'g')
      const namespaceRegex = new RegExp(originalNamespace, 'g')
      const updatedContent = content.replace(projectNameRegex, projectName).replace(namespaceRegex, namespace)
      return fs.promises.writeFile(file, updatedContent)
    } catch (err) {
      console.error(err)
    }
  }))
  console.log('Completed projectName update.')
}

async function updateProjectDescription (description) {
  const filesToUpdate = ['package.json']

  console.log(`Updating description from '${originalDescription}', to '${description}'. In...`)
  await Promise.all(filesToUpdate.map(async (file) => {
    console.log(file)
    const content = await fs.promises.readFile(file, 'utf8')
    const updatedContent = content.replace(originalDescription, description)
    return fs.promises.writeFile(file, updatedContent)
  }))
  console.log('Completed description update.')
}

async function rename () {
  const { description, projectName } = processInput(process.argv)
  const rename = await confirmRename(projectName, description)
  if (rename) {
    await updateProjectName(projectName)
    await updateProjectDescription(description)
  } else {
    console.log('Project has not been renamed.')
  }
}

rename()
