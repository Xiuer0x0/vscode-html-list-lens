export type Position = {
  line: number;
  char: number;
};

export type LiInfo = {
  start: Position;
  end: Position;
  level: number;
  index: number;
  path: number[];
};

type Token = {
  type: 'open-li' | 'close-li' | 'open-list' | 'close-list';
  listType?: 'ul' | 'ol';
  position: Position;
  raw: string;
};

export function extractLiHierarchy(text: string): LiInfo[] {
  const lines = text.split('\n');
  const tokens: Token[] = [];
  const tagRegex = /<(\/?)(ul|ol|li)\b[^>]*?>/gi;

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    let match: RegExpExecArray | null;

    tagRegex.lastIndex = 0;

    while ((match = tagRegex.exec(line))) {
      const [raw, slash, tag] = match;
      const position: Position = {
        line: lineIdx + 1,
        char: match.index + 1,
      };

      if (tag === 'ul' || tag === 'ol') {
        tokens.push({
          type: slash ? 'close-list' : 'open-list',
          listType: tag as 'ul' | 'ol',
          position,
          raw,
        });
      } else if (tag === 'li') {
        tokens.push({
          type: slash ? 'close-li' : 'open-li',
          position,
          raw,
        });
      }
    }
  }

  const result: LiInfo[] = [];

  const stack: {
    type: 'ul' | 'ol';
    counter: number;
    path: number[];
  }[] = [];

  const liOpenStack: {
    path: number[];
  }[] = [];

  const liPairStack: {
    start: Position;
    path: number[];
  }[] = [];

  for (const token of tokens) {
    switch (token.type) {
      case 'open-list': {
        // 🧠 關鍵：判斷是否目前有一個未結束的 li，才繼承其 path
        const inheritPath = liOpenStack.length > 0
          ? [...liOpenStack[liOpenStack.length - 1].path]
          : [];

        stack.push({
          type: token.listType!,
          counter: 0,
          path: inheritPath,
        });

        break;
      }

      case 'close-list':
        stack.pop();
        break;

      case 'open-li':
        if (stack.length === 0) {
          break;
        }

        const currentList = stack[stack.length - 1];
        currentList.counter++;
        const path = [...currentList.path, currentList.counter];

        // push 到尚未關閉的 li stack
        liOpenStack.push({ path });
        liPairStack.push({
          start: token.position,
          path,
        });
        break;

      case 'close-li': {
        const li = liPairStack.pop();

        liOpenStack.pop();

        if (li) {
          result.push({
            start: li.start,
            end: token.position,
            level: li.path.length,
            index: li.path.at(-1)!,
            path: li.path,
          });
        }

        break;
      }
    }
  }

  return result;
}
