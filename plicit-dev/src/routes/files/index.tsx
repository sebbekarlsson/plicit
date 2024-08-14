import { Component } from "plicit";
import { FileTree } from "../../components/file-tree";
import { PageContent } from "../../layouts/page-content";

export const FilesRoute: Component = () => {
  return <PageContent>
    <FileTree/>
  </PageContent>;
} 
