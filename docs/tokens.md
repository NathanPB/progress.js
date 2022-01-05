# Tokens

Tokens are usually imported as:

```typescript
import { Tokens } from '@nathanpb/progress'

Tokens.bar({ length: 10 })
Tokens.progress()
```

## Prebuilt tokens

- [Tokens.bar](/api/modules/Tokens.html#bar)
- [Tokens.elapsedTime](/api/modules/Tokens.html#elapsedTime)
- [Tokens.progress](/api/modules/Tokens.html#progress)
- [Tokens.current](/api/modules/Tokens.html#current)
- [Tokens.total](/api/modules/Tokens.html#total)
- [Tokens.title](/api/modules/Tokens.html#title)
- [Tokens.rate](/api/modules/Tokens.html#rate)
- [Tokens.eta](/api/modules/Tokens.html#eta)
- [Tokens.mutable](/api/modules/Tokens.html#mutable)

## Writing a custom token

A token is just a ``(bar: ProgressBar)=>string`` function, so you can easily write your custom tokens like:

[example/custom-token.ts](/example/custom-token.ts ':include')
