import { forEachInlineChild } from 'markdownlint-rule-helpers'

import {
  addFixErrorDetail,
  getRange,
  isStringQuoted,
  isStringPunctuated,
} from '../helpers/utils.js'

export const imageAltTextEndPunctuation = {
  names: ['GHD002', 'image-alt-text-end-punctuation'],
  description: 'Alternate text for images should end with a punctuation.',
  tags: ['accessibility', 'images'],
  information: new URL('https://github.com/github/docs/blob/main/src/content-linter/README.md'),
  function: function GHD003(params, onError) {
    forEachInlineChild(params, 'image', function forToken(token) {
      const imageAltText = token.content.trim()

      // If the alt text is empty, there is nothing to check and you can't
      // produce a valid range.
      // We can safely return early because the image-alt-text-length rule
      // will fail this one.
      if (!imageAltText) return

      if (isStringPunctuated(imageAltText)) return

      const range = getRange(token.line, imageAltText)

      addFixErrorDetail(onError, token.lineNumber, imageAltText + '.', imageAltText, range, {
        lineNumber: token.lineNumber,
        editColumn: isStringQuoted(imageAltText)
          ? token.line.indexOf(']')
          : token.line.indexOf(']') + 1,
        deleteCount: 0,
        insertText: '.',
      })
    })
  },
}
