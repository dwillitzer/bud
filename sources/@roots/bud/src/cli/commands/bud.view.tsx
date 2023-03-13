import BudCommand from '@roots/bud/cli/commands/bud'
import {Command, Option} from '@roots/bud-support/clipanion'
import Ink from '@roots/bud-support/ink'
import React from '@roots/bud-support/react'

/**
 * `bud view` command
 */
export default class BudViewCommand extends BudCommand {
  public static override paths = [[`view`]]
  public static override usage = Command.Usage({
    description: `Explore bud object`,
    examples: [
      [`view compiled config`, `$0 view`],
      [`view`, `$0 view env store`],
    ],
  })

  public color = Option.Boolean(`--color,-c`, true, {
    description: `use syntax highlighting`,
  })

  public indent = Option.String(`--indent,-i`, `2`, {
    description: `indentation level`,
    tolerateBoolean: true,
  })

  public subject = Option.String({name: `subject`, required: false})

  public override async execute() {
    const {highlight} = await import(`@roots/bud-support/highlight`)
    const {default: get} = await import(`@roots/bud-support/lodash/get`)
    const {default: format} = await import(
      `@roots/bud-support/pretty-format`
    )

    await this.makeBud(this)
    await this.bud.run()

    let value = this.subject ? get(this.bud, this.subject) : this.bud
    let indent = 0

    switch (this.indent) {
      case true:
        indent = 2
        break

      case false:
        indent = 0
        break

      case undefined:
        indent = 2
        break

      default:
        indent = parseInt(this.indent)
    }

    value = format(this.subject ? get(this.bud, this.subject) : this.bud, {
      indent,
    })

    if (this.color) value = highlight(value)

    await this.renderOnce(
      <Ink.Box>
        <Ink.Text color="magenta">
          {this.subject ?? `build.config`}
        </Ink.Text>
        <Ink.Text>{` `}</Ink.Text>
        <Ink.Text>{value}</Ink.Text>
      </Ink.Box>,
    )
  }
}
