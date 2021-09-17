import { useState, useEffect, useRef } from "react"
import { AxiosResponse } from 'axios';
import { FetchNodes } from '../Request';
import { IClusterDetail } from "../App"
import { NodesComponent } from './Nodes';
import { IMessageBarStyles, MessageBar, MessageBarType, Stack } from '@fluentui/react';
import { nodesKey } from "../ClusterDetail";

const errorBarStyles: Partial<IMessageBarStyles> = { root: { marginBottom: 15 } }

interface INode {
  status: string,
  name: string,
  createdTime: string,
  resourceUsage: string
}

export function NodesWrapper(props: {
  currentCluster: IClusterDetail
  detailPanelSelected: string
  loaded: string
}) {
  const [data, setData] = useState<any>([])
  const [error, setError] = useState<AxiosResponse | null>(null)
  const state = useRef<NodesComponent>(null)
  const [fetching, setFetching] = useState("")

  const errorBar = (): any => {
    return (
      <MessageBar
        messageBarType={MessageBarType.error}
        isMultiline={false}
        onDismiss={() => setError(null)}
        dismissButtonAriaLabel="Close"
        styles={errorBarStyles}
      >
        {error?.statusText}
      </MessageBar>
    )
  }

  // updateData - updates the state of the component
  // can be used if we want a refresh button.
  // api/clusterdetail returns a single item.
  const updateData = (newData: any) => {
    setData(newData)
    let nodeList: INode[] = []
    if (state && state.current) {
      newData.nodes.forEach((element: { name: any; createdTime: any; }) => {
        let node: INode = {
          status: "Good",
          name: element.name,
          createdTime: element.createdTime,
          resourceUsage: "20%"
        }
        nodeList.push(node)
      });
      state.current.setState({ nodes: nodeList })
    }
  }

  useEffect(() => {
    const onData = (result: AxiosResponse | null) => {
      if (result?.status === 200) {
        updateData(result.data)
      } else {
        setError(result)
      }
      setFetching(props.currentCluster.clusterName)
    }

    if (props.detailPanelSelected.toLowerCase() == nodesKey && 
        fetching === "" &&
        props.loaded === "DONE" &&
        props.currentCluster.clusterName != "") {
      setFetching("FETCHING")
      FetchNodes(props.currentCluster.subscription, props.currentCluster.resource, props.currentCluster.clusterName).then(onData) // TODO: fetchClusterInfo accepts IClusterDetail
    }
  }, [data, props.currentCluster.clusterName, props.loaded, props.detailPanelSelected])

  return (
    <Stack>
      <Stack.Item grow>{error && errorBar()}</Stack.Item>
      <Stack>
        <NodesComponent nodes={data} ref={state} clusterName={props.currentCluster.clusterName}/>
      </Stack>
    </Stack>   
  )
}
