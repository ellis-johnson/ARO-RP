import { useState, useEffect, useRef } from "react"
import { AxiosResponse } from 'axios';
import { FetchMachines } from '../Request';
import { IClusterDetail } from "../App"
import { MachinesComponent } from './Machines';
import { IMessageBarStyles, MessageBar, MessageBarType, Stack } from '@fluentui/react';
import { machinesKey } from "../ClusterDetail";

export interface IMachine {
  name?: string,
  createdTime: string,
  lastUpdated: string,
  errorReason: string,
  errorMessage: string,
  lastOperation: string,
  lastOperationDate: string,
  status: string
}

export function MachinesWrapper(props: {
  currentCluster: IClusterDetail
  detailPanelSelected: string
  loaded: string
}) {
  const [data, setData] = useState<any>([])
  const [error, setError] = useState<AxiosResponse | null>(null)
  const state = useRef<MachinesComponent>(null)
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
    let machineList: IMachine[] = []
    if (state && state.current) {
      newData.machines.forEach((element: { name: string;
                                           createdTime: string;
                                           lastUpdated: string;
                                           errorReason: string;
                                           errorMessage: string;
                                           lastOperation: string;
                                           lastOperationDate: string;
                                           status: string; }) => {
        let machine: IMachine = {
          name: element.name,
          createdTime: element.createdTime,
          lastUpdated: element.lastUpdated,
          errorReason: element.errorReason,
          errorMessage: element.errorMessage,
          lastOperation: element.lastOperation,
          lastOperationDate: element.lastOperationDate,
          status: element.status,
        }
        machineList.push(machine)
      });
      state.current.setState({ machines: machineList })
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

    if (props.detailPanelSelected.toLowerCase() == machinesKey && 
        fetching === "" &&
        props.loaded === "DONE" &&
        props.currentCluster.clusterName != "") {
      setFetching("FETCHING")
      FetchMachines(props.currentCluster.subscription, props.currentCluster.resource, props.currentCluster.clusterName).then(onData) // TODO: fetchClusterInfo accepts IClusterDetail
    }
  }, [data, props.currentCluster.clusterName, props.loaded, props.detailPanelSelected])

  return (
    <Stack>
      <Stack.Item grow>{error && errorBar()}</Stack.Item>
      <Stack>
        <MachinesComponent machines={data!} ref={state} clusterName={props.currentCluster.clusterName}/>
      </Stack>
    </Stack>   
  )
}
