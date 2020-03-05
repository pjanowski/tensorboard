/* Copyright 2020 The TensorFlow Authors. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/
import {Component, Input} from '@angular/core';
import {select, Store, createSelector} from '@ngrx/store';

import {Execution, State, TensorDebugMode} from '../../store/debugger_types';

import {getFocusedExecutionData} from '../../store';

/** @typehack */ import * as _typeHackRxjs from 'rxjs';

@Component({
  selector: 'tf-debugger-v2-execution-data',
  template: `
    <execution-data-component
      [focusedExecutionIndex]="focusedExecutionIndex"
      [focusedExecutionData]="focusedExecutionData$ | async"
      [tensorDebugMode]="tensorDebugMode$ | async"
      [hasDebugTensorValues]="hasDebugTensorValues$ | async"
      [debugTensorValues]="debugTensorValues$ | async"
    ></execution-data-component>
  `,
})
export class ExecutionDataContainer {
  @Input()
  focusedExecutionIndex!: number;

  readonly focusedExecutionData$ = this.store.pipe(
    select(getFocusedExecutionData)
  );

  readonly tensorDebugMode$ = this.store.pipe(
    select(
      createSelector(
        getFocusedExecutionData,
        (execution: Execution | null) => {
          if (execution === null) {
            return TensorDebugMode.UNSPECIFIED;
          } else {
            return execution.tensor_debug_mode;
          }
        }
      )
    )
  );

  readonly hasDebugTensorValues$ = this.store.pipe(
    select(
      createSelector(
        getFocusedExecutionData,
        (execution: Execution | null) => {
          if (execution === null || execution.debug_tensor_values === null) {
            return false;
          } else {
            for (const singleDebugTensorValues of execution.debug_tensor_values) {
              if (
                singleDebugTensorValues !== null &&
                singleDebugTensorValues.length > 0
              ) {
                return true;
              }
            }
            return false;
          }
        }
      )
    )
  );

  readonly debugTensorValues$ = this.store.pipe(
    select(
      createSelector(
        getFocusedExecutionData,
        (execution: Execution | null) => {
          if (execution === null) {
            return null;
          } else {
            return execution.debug_tensor_values;
          }
        }
      )
    )
  );

  constructor(private readonly store: Store<State>) {}
}