# Test


##  How to write a test

it's essential to adhere to the following principles:

- Test descriptions should be meaningful.
- Use only English lowercase letters for descriptions.
- Test descriptions is better to start with the verb.
- Provide specific details about the functionality being tested.
- Use descriptive names for tests to facilitate understanding.
- Organize tests logically to enhance readability and navigation.
- Use edge cases and boundary conditions to ensure comprehensive testing.
- You can use `@faker-js/faker` library to create fake data



## Examples

To clarify the topic, some examples of token sort tests are given:

good example:
 - put pinned tokens first
 - put native tokens first
 - should be first result when address contains searched term

bad example:
- pinned tokens are displayed first
- put pinned tokens
- Put Pinned tokens first
- when address contains searched term, should be first
    