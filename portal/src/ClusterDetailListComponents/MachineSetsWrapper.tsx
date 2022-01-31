import { useState, useEffect, useRef } from "react"
import { AxiosResponse } from 'axios';
import { FetchMachineSets } from '../Request';
import { IClusterDetail } from "../App"
import { IMessageBarStyles, MessageBar, MessageBarType, Stack } from '@fluentui/react';
import { machineSetsKey } from "../ClusterDetail";
import { MachineSetsComponent } from "./MachineSets";

export interface IMachineSet {
  name?: string,
  type?: string,
  createdAt?: string,
  desiredReplicas?: string,
  replicas?: string,
  errorReason?: string,
  errorMessage?: string
}

export function MachineSetsWrapper(props: {
  currentCluster: IClusterDetail
  detailPanelSelected: string
  loaded: string
}) {
  const [data, setData] = useState<any>([])
  const [error, setError] = useState<AxiosResponse | null>(null)
  const state = useRef<MachineSetsComponent>(null)
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
    let machineSetList: IMachineSet[] = []
    if (state && state.current) {
      newData.machines.forEach((element: { name: string;
                                           type: string;
                                           createdat: string;
                                           desiredreplicas: number;
                                           replicas: number;
                                           errorreason: string;
                                           errormessage: string;}) => {
        let machineSet: IMachineSet = {
          name: element.name,
          type: element.type,
          createdAt: element.createdat,
          desiredReplicas: element.desiredreplicas.toString(),
          replicas: element.replicas.toString(),
          errorReason: element.errorreason,
          errorMessage: element.errormessage,
        }
        machineSetList.push(machineSet)
      });
      state.current.setState({ machineSets: machineSetList })
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

    if (props.detailPanelSelected.toLowerCase() == machineSetsKey && 
        fetching === "" &&
        props.loaded === "DONE" &&
        props.currentCluster.clusterName != "") {
      setFetching("FETCHING")
      FetchMachineSets(props.currentCluster.subscription, props.currentCluster.resource, props.currentCluster.clusterName).then(onData)
    }
  }, [data, props.currentCluster.clusterName, props.loaded, props.detailPanelSelected])

  return (
    <Stack>
      <Stack.Item grow>{error && errorBar()}</Stack.Item>
      <Stack>
        <MachineSetsComponent machineSets={data!} ref={state} clusterName={props.currentCluster.clusterName}/>
      </Stack>
    </Stack>   
  )
}
