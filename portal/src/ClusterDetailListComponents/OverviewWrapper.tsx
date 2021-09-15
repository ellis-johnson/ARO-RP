import { useState, useEffect, useRef } from "react"
import { AxiosResponse } from 'axios';
import { FetchClusterInfo } from '../Request';
import { IClusterDetail } from "../App"
import { ClusterDetailComponent } from '../ClusterDetailList'
import { OverviewComponent } from './Overview';
import { IMessageBarStyles, MessageBar, MessageBarType, Stack } from '@fluentui/react';
import { overviewKey } from "../ClusterDetail";

const errorBarStyles: Partial<IMessageBarStyles> = { root: { marginBottom: 15 } }

export function OverviewWrapper(props: {
  currentCluster: IClusterDetail
  detailPanelSelected: string
  loaded: string
}) {
  const [data, setData] = useState<any>([])
  const [error, setError] = useState<AxiosResponse | null>(null)
  const state = useRef<ClusterDetailComponent>(null)
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
    if (state && state.current) {
      state.current.setState({ item: newData, detailPanelSelected: props.detailPanelSelected })
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

    if (props.detailPanelSelected.toLowerCase() == overviewKey && 
        fetching === "" &&
        props.loaded === "DONE" &&
        props.currentCluster.clusterName != "") {
      setFetching("FETCHING")
      FetchClusterInfo(props.currentCluster.subscription, props.currentCluster.resource, props.currentCluster.clusterName).then(onData) // TODO: fetchClusterInfo accepts IClusterDetail
    }
  }, [data, props.currentCluster.clusterName, props.loaded])

  return (
    <Stack>
      <Stack.Item grow>{error && errorBar()}</Stack.Item>
      <Stack>
        <OverviewComponent item={data} clusterName={props.currentCluster.clusterName}/>
      </Stack>
    </Stack>   
  )
}
