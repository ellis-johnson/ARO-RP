import { useState, useEffect, useRef } from "react"
import { AxiosResponse } from 'axios';
import { FetchNodes } from '../Request';
import { IClusterDetail } from "../App"
import { NodesComponent } from './Nodes';
import { IMessageBarStyles, MessageBar, MessageBarType, Stack } from '@fluentui/react';
import { nodesKey } from "../ClusterDetail";

export interface Condition {
  type: string,
  status: string,
  lastHeartbeatTime: string,
  lastTransitionTime: string,
  message: string
}

export interface Resource {
  capacity: string,
  allocatable: string
}

export interface ResourceUsage {
  cpu: Resource,
  memory: Resource,
  storageVolume: Resource
  pods: Resource
}

export interface Taint {
  key: string,
  effect: string
}


export interface INode {
  name: string,
  createdTime: string,
  resources: ResourceUsage,
  conditions?: Condition[],
  taints?: Taint[]
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

  const errorBarStyles: Partial<IMessageBarStyles> = { root: { marginBottom: 15 } }

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
      newData.nodes.forEach((element: { name: any; createdTime: any; capacity: any; allocatable: any; taints: Taint[], conditions: Condition[]}) => {
        let node: INode = {
          name: element.name,
          createdTime: element.createdTime,
          resources: {
            cpu: {
              capacity: element.capacity.CPU,
              allocatable: element.allocatable.CPU
            },
            storageVolume: {
              capacity: element.capacity.StorageVolume,
              allocatable: element.allocatable.StorageVolume
            },
            memory: {
              capacity: element.capacity.Memory,
              allocatable: element.allocatable.Memory
            },
            pods: {
              capacity: element.capacity.Pods,
              allocatable: element.allocatable.Pods
            }
          }
        }
        node.taints = []
        element.taints.forEach((taint: Taint) => {
          node.taints!.push(taint)
        });
        node.conditions = []
        element.conditions.forEach((condition: Condition) => {
          node.conditions!.push(condition)
        });
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
        <NodesComponent nodes={data!} ref={state} clusterName={props.currentCluster.clusterName}/>
      </Stack>
    </Stack>   
  )
}
