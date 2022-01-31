import { Component } from "react"
import { OverviewWrapper } from './ClusterDetailListComponents/OverviewWrapper';
import { NodesWrapper } from './ClusterDetailListComponents/NodesWrapper';
import { MachinesWrapper } from "./ClusterDetailListComponents/MachinesWrapper";
import { IClusterDetail } from "./App";
import { MachineSetsWrapper } from "./ClusterDetailListComponents/MachineSetsWrapper";

interface ClusterDetailComponentProps {
  item: any
  clusterInfo: IClusterDetail
  detailPanelSelected: string
  loaded: string
}

interface IClusterDetailComponentState {
  item: IClusterDetails // why both state and props?
  detailPanelSelected: string
}

export interface IClusterDetails {
  apiServerVisibility: string
  apiServerURL: string
  architectureVersion: string
  consoleLink: string
  createdAt: string
  createdBy: string
  failedProvisioningState: string
  infraId: string
  lastAdminUpdateError: string
  lastModifiedAt: string
  lastModifiedBy: string
  lastProvisioningState: string
  location: string
  name: string
  provisioningState: string
  resourceId: string
  version: string
  installStatus: string
}

export class ClusterDetailComponent extends Component<ClusterDetailComponentProps, IClusterDetailComponentState> {

  constructor(props: ClusterDetailComponentProps | Readonly<ClusterDetailComponentProps>) {
    super(props);
  }

  public render() {
    switch (this.props.detailPanelSelected.toLowerCase()) {
      case "overview":
      {
        return (
          <OverviewWrapper currentCluster={this.props.clusterInfo} detailPanelSelected={this.props.detailPanelSelected} loaded={this.props.loaded}/>
        )
      }
      case "nodes":
        {
          return (
            <NodesWrapper currentCluster={this.props.clusterInfo} detailPanelSelected={this.props.detailPanelSelected} loaded={this.props.loaded}/>
          );
        }
        case "machines":
        {
          return (
            <MachinesWrapper currentCluster={this.props.clusterInfo} detailPanelSelected={this.props.detailPanelSelected} loaded={this.props.loaded}/>
          );
        }
        case "machinesets":
        {
          return (
            <MachineSetsWrapper currentCluster={this.props.clusterInfo} detailPanelSelected={this.props.detailPanelSelected} loaded={this.props.loaded}/>
          );
        }
      }
  }
};
