import {initSimpleBar, ProgressBar, Tokens} from '@nathanpb/progress';
import download from 'download'

const bar = new ProgressBar({ title: 'Download Progress' })

download('https://example.com')
  .on('response', res => {
    bar.tital = parseInt(res.headers['content-length'])
    res.on('data', data => bar.tick(data.length))
  })

initSimpleBar({
  bar,
  template: '$title$ [$bar$] $progress$ $rate$ mb/s',
  tokens: {
    title: Tokens.title(),
    bar: Tokens.bar({ length: 10 }),
    progress: Tokens.progress(),
    rate: Tokens.rate({  })
  }
})

