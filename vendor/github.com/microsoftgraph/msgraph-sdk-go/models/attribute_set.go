package models

import (
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91 "github.com/microsoft/kiota-abstractions-go/serialization"
)

// AttributeSet 
type AttributeSet struct {
    Entity
}
// NewAttributeSet instantiates a new attributeSet and sets the default values.
func NewAttributeSet()(*AttributeSet) {
    m := &AttributeSet{
        Entity: *NewEntity(),
    }
    return m
}
// CreateAttributeSetFromDiscriminatorValue creates a new instance of the appropriate class based on discriminator value
func CreateAttributeSetFromDiscriminatorValue(parseNode i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable, error) {
    return NewAttributeSet(), nil
}
// GetDescription gets the description property value. The description property
func (m *AttributeSet) GetDescription()(*string) {
    val, err := m.GetBackingStore().Get("description")
    if err != nil {
        panic(err)
    }
    if val != nil {
        return val.(*string)
    }
    return nil
}
// GetFieldDeserializers the deserialization information for the current model
func (m *AttributeSet) GetFieldDeserializers()(map[string]func(i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode)(error)) {
    res := m.Entity.GetFieldDeserializers()
    res["description"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetStringValue()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetDescription(val)
        }
        return nil
    }
    res["maxAttributesPerSet"] = func (n i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.ParseNode) error {
        val, err := n.GetInt32Value()
        if err != nil {
            return err
        }
        if val != nil {
            m.SetMaxAttributesPerSet(val)
        }
        return nil
    }
    return res
}
// GetMaxAttributesPerSet gets the maxAttributesPerSet property value. The maxAttributesPerSet property
func (m *AttributeSet) GetMaxAttributesPerSet()(*int32) {
    val, err := m.GetBackingStore().Get("maxAttributesPerSet")
    if err != nil {
        panic(err)
    }
    if val != nil {
        return val.(*int32)
    }
    return nil
}
// Serialize serializes information the current object
func (m *AttributeSet) Serialize(writer i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.SerializationWriter)(error) {
    err := m.Entity.Serialize(writer)
    if err != nil {
        return err
    }
    {
        err = writer.WriteStringValue("description", m.GetDescription())
        if err != nil {
            return err
        }
    }
    {
        err = writer.WriteInt32Value("maxAttributesPerSet", m.GetMaxAttributesPerSet())
        if err != nil {
            return err
        }
    }
    return nil
}
// SetDescription sets the description property value. The description property
func (m *AttributeSet) SetDescription(value *string)() {
    err := m.GetBackingStore().Set("description", value)
    if err != nil {
        panic(err)
    }
}
// SetMaxAttributesPerSet sets the maxAttributesPerSet property value. The maxAttributesPerSet property
func (m *AttributeSet) SetMaxAttributesPerSet(value *int32)() {
    err := m.GetBackingStore().Set("maxAttributesPerSet", value)
    if err != nil {
        panic(err)
    }
}
// AttributeSetable 
type AttributeSetable interface {
    Entityable
    i878a80d2330e89d26896388a3f487eef27b0a0e6c010c493bf80be1452208f91.Parsable
    GetDescription()(*string)
    GetMaxAttributesPerSet()(*int32)
    SetDescription(value *string)()
    SetMaxAttributesPerSet(value *int32)()
}
