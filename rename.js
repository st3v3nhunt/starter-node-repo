#!/usr/bin/env node

const fs = require('fs')
const readline = require('readline')

const { description: originalDescription, name: originalProjectName } = require('./package.json')

function processInput (args) {
  const [, , projectName, description] = args
  if (args.length === 2) {
    console.error('Please enter a new name and description for the project e.g. my-new-repo "Really useful description".')
    process.exit(1)
  }
  if (args.length !== 4 || !projectName || !description) {
    const errMsg = [
      'Please enter a new name and description for the project.',
      'The description must not be empty and be wrapped in quotation marks e.g. "Really useful description".'
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
  return new Promise((resolve, _) => {
    rl.question(`Do you want to rename the project to '${projectName}', with a description of '${description}'?\nType '${affirmativeAnswer}' to confirm\n`, (answer) => {
      rl.close()
      resolve(answer === affirmativeAnswer)
    })
  })
}

// Not all of these files are in the repo, the rename will ignore the error if
// any are missing and these might be useful to add at some point
function getRootFiles () {
  return ['docker-compose.yaml', 'docker-compose.override.yaml', 'package.json', 'package-lock.json', 'README.md']
}

async function updateProjectName (projectName) {
  const rootFiles = getRootFiles()
  const filesToUpdate = [...rootFiles]

  console.log(`Updating projectName from '${originalProjectName}', to '${projectName}'. In...`)
  await Promise.all(filesToUpdate.map(async (file) => {
    console.log(file)
    try {
      const content = await fs.promises.readFile(file, 'utf8')
      const projectNameRegex = new RegExp(originalProjectName, 'g')
      const updatedContent = content.replace(projectNameRegex, projectName)
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
    console.time('rename')
    Promise
      .allSettled([
        updateProjectName(projectName),
        updateProjectDescription(description)
      ])
      .then(() => console.timeEnd('rename'))
  } else {
    console.log('Project has not been renamed.')
  }
}

rename()
