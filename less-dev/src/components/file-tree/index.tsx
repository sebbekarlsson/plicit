import { Component, computed, ref, unref, type Ref } from "less";
import { EFileType, FSNode } from "./types";
import { ITree } from "../tree/types";
import { Tree } from "../tree";
import { Icon } from "../icon";
import { IconPrimitive } from "../icon/types";
import { useTree } from "../tree/hooks";


const directory = (node: Omit<FSNode, 'isDir'>): FSNode => {
  return {
    ...node,
    isDir: true
  }
}

const file = (node: Omit<FSNode, 'isDir'>): FSNode => {
  return {
    ...node,
    isDir: false
  }
}

const NODE_SIZE = '1.7rem';

const getIcon = (node: FSNode): IconPrimitive => {

  const getSrc = () => {
    if (node.isDir) return async () => import('../../assets/icons/folder.svg');
    switch (node.type) {
      case EFileType.TEXT: return async () =>  import('../../assets/icons/file-text.svg');
      case EFileType.IMAGE: return async () =>  import('../../assets/icons/file-image.svg'); 
      case EFileType.PDF: return async () =>  import('../../assets/icons/file-pdf.svg'); 
      default: return async () =>  import('../../assets/icons/file.svg');
    }
  }

  return {
    src: getSrc(),
    fill: 'currentColor',
    size: NODE_SIZE 
  }
}

const createTree = (root: FSNode): Ref<ITree<FSNode>> => {
  let count: number = 0;
  
  const create = (node: FSNode, id: number, depth: number = 0): Ref<ITree<FSNode>> => {
    return ref({
      name: node.name,
      id: id,
      data: node,
      children: (node.children || []).map(child => create(child, count++, depth + 1)),

      render: (x) => {
        return <div  class="select-none text-gray-600 cursor-pointer hover:text-blue-500" style={{
          display: 'grid',
          gridTemplateColumns: `${NODE_SIZE} max-content`,
          gap: '0.5rem',
          alignItems: 'center',
          ...(unref(x.node).selected ? {
            background: 'red'
          } : {})
        }}>
          <Icon class="text-gray-300" icon={getIcon(node)}/>
          <div class="text-xs">{node.name}</div>
        </div>;
      }
    })
  }
  return create(root, count++);
}

export const FileTree: Component = () => {
  const fsRoot: FSNode = directory({
    name: 'Home',
    children: [
      file({ name: 'README.txt', type: EFileType.TEXT }),
      directory({
        name: 'My Documents',
        children: [
          file({ name: 'invoice.pdf', type: EFileType.PDF }),
          file({ name: 'notes.txt', type: EFileType.TEXT }),
          file({ name: 'presentation.docx' }),
          file({ name: 'transactions.csv', type: EFileType.TEXT })
        ]
      }),
      directory({
        name: 'Trash',
        children: [
          file({ name: 'old_car.jpeg', type: EFileType.IMAGE })
        ]
      })
    ]
  });

  const root = createTree(fsRoot);

  const hook = useTree({
    root: root
  });

  return <Tree deps={[hook.selectedId]} root={root} hook={hook}/>
}
