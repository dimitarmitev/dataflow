using DataflowApp.Hubs;
using System.Threading.Tasks.Dataflow;

namespace DataflowApp.Pipes
{
    public class BatchPipe : BasePipe
    {
        public BatchPipe(IServiceProvider sp): 
            base(sp)
        {
            var batchBlock =
                new BatchBlock<Shape>(5);
            var actionBlock =
                new ActionBlock<Shape[]>(
                    async (shapes) =>
                    {
                        await SendShapes(shapes);
                    }
                );
            batchBlock.LinkTo(actionBlock);
            EntryPoint = batchBlock;
        }
    }
}
