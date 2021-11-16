package cluster

// Copyright (c) Microsoft Corporation.
// Licensed under the Apache License 2.0.

import (
	"context"

	machineapi "github.com/openshift/machine-api-operator/pkg/apis/machine/v1beta1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

type MachinesInformation struct {
	Name         string `json:"name"`
	CreatedTime  string `json:"createdtime"`
	LastUpdated  string `json:"lastupdated"`
	ErrorReason  string `json:"errorreason"`
	ErrorMessage string `json:"errormessage"`
}

type MachineListInformation struct {
	Machines []MachinesInformation `json:"machines"`
}

func MachinesFromMachineList(machines *machineapi.MachineList) *MachineListInformation {
	final := &MachineListInformation{
		Machines: make([]MachinesInformation, 0, len(machines.Items)),
	}

	for _, machine := range machines.Items {
		// TODO: Add Null fields seperately!

		final.Machines = append(final.Machines, MachinesInformation{
			Name:        machine.Name,
			CreatedTime: machine.CreationTimestamp.String(),
			LastUpdated: machine.Status.LastUpdated.String(),
		})
	}

	return final
}

func (f *realFetcher) Machines(ctx context.Context) (*MachineListInformation, error) {
	r, err := f.maoclient.MachineV1beta1().Machines("").List(ctx, metav1.ListOptions{})
	if err != nil {
		return nil, err
	}

	return MachinesFromMachineList(r), nil
}

func (c *client) Machines(ctx context.Context) (*MachineListInformation, error) {
	return c.fetcher.Machines(ctx)
}
