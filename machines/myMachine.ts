import { assign, createMachine, send, sendTo } from "xstate";

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEMAOqB0AbA9siAlgHZQAEALjhDrAMQDGAFsiWBrOcuQK6wDaABgC6iUKhoFyBHEVEgAHogAsATgwAmAIxKArEoEAOAGw6DAZgFGANCACeiALQq169SoDsApUvUH3K-XcAXyCbNExcfGIySmo6fAgMWJxBESQQcVhJaVl0xQQHHSN1DE1i91MjTwF3dzMbewLXEs9fIyMa5p0VIxCw9Gw8QhIKKhoGZlYMYlRuclS5TOyZOXzC2owzTU1XFTMjHd8DBsRNbs2endUVAU13JXM+kHDBqJHkuggwLDByNmSFukllIVnlEHsMAIdFtjDp1Dp3CZjnZEOp3JoMBV1Ep9nstvojEoni9IsMYmM6JBJEkxoCxBIQblQGsfO5ShUemY0Vobn4Tk0jAZMWY8Td3OojFyVMSBlSpO8xrRYMgAG7-WnCRYMnKrRwGG6lVR6JSaDyuMw6fkOM6Qk0dW4Ssz7SVmGWYOXRUbUCYsGDTIizeaaoHa0HMxwHMwYAxaC1VE0WLz8mEYFQxiradrdWqup5EKhwOThLVZRm6gp7IXaFTG03i9QWq1xjQisxKSU1Ixp3qhZ4DUmej4l5ZMhSOHEYmptk36sredRNnSlAzQzRmFeCgJQnRujAehXUYdlsEFYwCDBVLeSwVwtf8htGUoWJ1VARv8w4kIhIA */
    id: "app",

    predictableActionArguments: true,
    context: {
      data: [] as { message: string; isDone: boolean }[],
      inpMessage: "",
    },
    schema: {
      events: {} as
        | { type: "change.input"; data: string }
        | { type: "add.todo" }
        | { type: "delete.todo"; i: number }
        | { type: "change.status"; i: number }
        | {
            type: "edit.todo";
          }
        | {
            type: "save.todo";
            i: number;
          },
    },

    states: {
      "loading todos": {
        entry: "load.todos",

        on: {
          "change.status": {
            actions: [
              assign({
                data: (ctx, ev) => {
                  return ctx.data.map((item, i) => {
                    if (i === ev.i) {
                      return { ...item, isDone: !item.isDone };
                    }
                    return item;
                  });
                },
              }),
              (ctx, ev) => {
                localStorage.setItem("data", JSON.stringify(ctx.data));
              },
            ],
          },
          "add.todo": {
            target: "loading todos",
            actions: [
              assign({
                data: (ctx, ev) => [
                  ...ctx.data,
                  { message: ctx.inpMessage, isDone: false },
                ],
              }),
              (ctx, ev) => {
                localStorage.setItem("data", JSON.stringify(ctx.data));
              },
            ],
          },

          "change.input": {
            actions: assign({ inpMessage: (ctx, ev) => ev.data }),
            internal: true,
          },
          "delete.todo": {
            actions: [
              assign({
                data: (ctx, ev) => ctx.data.filter((item, i) => i !== ev.i),
              }),
              (ctx, ev) => {
                localStorage.setItem("data", JSON.stringify(ctx.data));
              },
            ],
          },
          "edit.todo": {
            target: "editing todo",
          },
        },
      },
      "editing todo": {
        on: {
          "save.todo": {
            target: "loading todos",
            actions: [
              assign({
                data: (ctx, ev) =>
                  ctx.data.map((item, i) => {
                    if (i === ev.i) {
                      return { ...item, message: ctx.inpMessage };
                    }
                    return item;
                  }),
              }),
              (ctx, ev) => {
                localStorage.setItem("data", JSON.stringify(ctx.data));
              },
            ],
          },
          "change.input": {
            actions: assign({ inpMessage: (ctx, ev) => ev.data }),
            internal: true,
          },
        },
      },
    },

    initial: "loading todos",
  },
  {
    actions: {
      "load.todos": assign((ctx, ev) => {
        let dataLS;
        if (typeof window !== "undefined") {
          dataLS = localStorage.getItem("data");
        }

        if (dataLS) {
          return { data: JSON.parse(dataLS) };
        }
        return { data: [] };
      }),
    },
  }
);
