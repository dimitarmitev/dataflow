using DataflowApp.Hubs;
using System.IO.Pipelines;
using System.Threading.Tasks.Dataflow;

namespace DataflowApp.Pipes
{
    public class StraightPipeParallel : BasePipe
    {
        public StraightPipeParallel(IServiceProvider sp): 
            base(sp)
        {
            var actionBlock =
                new ActionBlock<Shape>(
                    async (shape) =>
                    {
                        await Task.Delay(1000);
                        await SendShape(shape);
                    },
                    new ExecutionDataflowBlockOptions()
                    {
                        MaxDegreeOfParallelism = 4
                    }
                );
            EntryPoint = actionBlock;
        }
    }
}
