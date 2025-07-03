/**
 * Chat and message types.
 */
import { Reaction } from '@/types'

export interface ChatReaction {
  messageId: number,
  reaction: Reaction[]
}