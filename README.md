
# Frontend
Front end code repository for SENG499 Summer 2022 project.

## Coding Standards
- Log all bugs you find to the Zenhub board
- Use [React hooks](https://reactjs.org/docs/hooks-rules.html) rather than [Classes](https://blog.bitsrc.io/6-reasons-to-use-react-hooks-instead-of-classes-7e3ee745fe04)
- Comment all hooks/functions with headers following the [JSDoc](https://jsdoc.app/tags-description.html) standard
- Follow the [Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/) standard for code organization
- Include your unit tests with your code changes
- If a component can be split up, split it up

## PR Standards
- Create a branch for your issue based on the issue number. For instance, Feature #18's branch will be `feature-18`
- Ensure the auto-assigner has assigned 2 "assignee"s to your PR
- No merges into `main` after 11:59pm on the Saturday before demo Mondays
- Ensure all 

### How to make a new PR
1. Make sure your local code is up to do date with `git fetch` and `git pull` on the `main` branch
2. Create a local branch for your change using the notation `<feature/bug>-<issue #>` ie. `bug-16` by running `git checkout -b <branch name>` ie. `git checkout -b bug-16`
3. Make your code changes
4. Push your code to the repo with `git add .`, `git commit -m "<comment>"`, and `git push -u origin <branch name>`
5. Go to the github UI and create a PR following the PR template
6. Create the PR and wait for the GitHub actions (assigner, tests, linter) to run
7. To make further changes, you can follow steps 3-5 again, but replace `git push -u origin <branch name>` with `git push`

## Reviewing Code
- Review all assigned PRs within 48 hours. If you can't get it done in that time, pass the review off to someone else on the team
- Try to provide at least one comment/criticism per PR


## Contributors

- Ahnaf Ahmed (@ahnaf-ahmed)

- Sam Warren (@sam-warren)

- Yuying Zhang (@NZ369)

- Hexuan Zhang (@Hexuan-Z)

- Ben Mazerolle (@bmazerolle)
