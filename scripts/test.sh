#!/usr/bin/env bash

# Default values for options
RUN_SCENARIOS=false
RUN_EXTRA_CREDIT=false
RUN_NORMAL_TESTS=false
INCLUDE_NON_DISTRIBUTION=false

# Function to show usage
show_usage() {
    cat << EOF
Usage: npm test -- [options | pattern]

Pattern:
  The pattern is a substring matched against test file names.
  Run "npm test -- mN" to run all tests from milestone N.
  Run "npm test -- sN" to run the scenario for milestone N (N/A for milestone 0).

Options:
  -a, --all               Run all tests (scenarios, extra credit, and normal tests)
  -s, --scenarios         Run the scenario tests (*.scenario.js)
  -ec, --extra-credit     Run the extra credit tests (*.extra.test.js)
  -t, --tests             Run the normal tests (*.test.js)
  -nd, --non-distribution Run the non-distribution tests
  -h, --help              Show this help message and exit

By default:
  - Only regular tests (*.test.js) run if no options are passed.
  - Tests in "non-distribution" are excluded unless -nd is specified.
EOF
}

check_stale_versions() {
    local stencil_pkg="$top/package.json"
    local lib_pkg="$top/node_modules/@brown-ds/distribution/package.json"

    if [ ! -f "$stencil_pkg" ] || [ ! -f "$lib_pkg" ]; then
        return 0
    fi

    local stencil_version
    local lib_version
    stencil_version=$(jq -r '.version' "$stencil_pkg")
    lib_version=$(jq -r '.version' "$lib_pkg")

    if [ -n "$stencil_version" ] && [ -n "$lib_version" ] && [ "$stencil_version" != "$lib_version" ]; then
        echo "[test] WARNING: Stencil version ($stencil_version) does not match installed library version ($lib_version)."
        echo "[test]          Reinstall dependencies or update the stencil to keep versions aligned."
    fi
}

top=$(git rev-parse --show-toplevel)
check_stale_versions

# Check for leftover ports from previous test runs
all_ports=$(grep -Rho 'port: [0-9]\+' "$top/test" | cut -d' ' -f2 | sort -n  | uniq)
for port in $all_ports; do
    if lsof -i tcp:"$port" &>/dev/null; then
        echo "[test] WARNING: Port $port is currently in use. This may interfere with test execution."
        echo "Use ./scripts/cleanup.sh to free up the port."
        echo "If this is unexpected, please investigate which process is using the port."
        echo "Use 'lsof -i tcp:$port' to identify the process."
        exit 1
    fi
done

PATTERN=""

# Parse command-line arguments
while [[ $# -gt 0 ]]; do
    case "$1" in
        -a|--all)
            RUN_SCENARIOS=true
            RUN_EXTRA_CREDIT=true
            RUN_NORMAL_TESTS=true
            shift
            ;;
        -s|--scenarios)
            RUN_SCENARIOS=true
            shift
            ;;
        -ec|--extra-credit)
            RUN_EXTRA_CREDIT=true
            shift
            ;;
        -t|--tests)
            RUN_NORMAL_TESTS=true
            shift
            ;;
        -nd|--non-distribution)
            INCLUDE_NON_DISTRIBUTION=true
            shift
            ;;
        -h|--help)
            show_usage
            exit 0
            ;;
        *)
            if [[ "$1" == -* ]]; then
                echo "Unknown option: $1" >&2
                show_usage >&2
                exit 1
            fi
            PATTERN="$1"
            shift
            ;;
    esac
done

# Construct the JEST command
COVERAGE_FLAGS=""
if [ "${COVERAGE:-}" = "1" ]; then
    COVERAGE_FLAGS="--coverage --coverageProvider=v8 --coverageDirectory /tmp/coverage --coverageReporters=text --coverageReporters=lcov"
fi
JEST_COMMAND="npx jest --maxWorkers=1 $COVERAGE_FLAGS"
JEST_COMMAND_FLAGS=""

# Add test matching logic (skip defaults when a pattern is provided)
if [ -z "$PATTERN" ]; then
    if $RUN_SCENARIOS; then
        JEST_COMMAND_FLAGS+=" --testMatch \"**/*.scenario.js\""
    fi

    if $RUN_EXTRA_CREDIT; then
        JEST_COMMAND_FLAGS+=" --testMatch \"**/*.extra.test.js\""
    fi

    if $RUN_NORMAL_TESTS || (! $RUN_SCENARIOS && ! $RUN_EXTRA_CREDIT && ! $RUN_NORMAL_TESTS); then
        JEST_COMMAND_FLAGS+=" --testMatch \"**/*.test.js\""
    fi
fi

# Scope to non-distribution when -nd is specified, otherwise exclude it.
if $INCLUDE_NON_DISTRIBUTION; then
    JEST_COMMAND_FLAGS+=" --testPathIgnorePatterns \"^(?!.*non-distribution).*\""
else
    JEST_COMMAND_FLAGS+=" --testPathIgnorePatterns \"non-distribution\""
fi

if ! $RUN_EXTRA_CREDIT; then
    JEST_COMMAND_FLAGS+=" --testPathIgnorePatterns \"extra\""
fi

# Warn if reference implementation is enabled
if [ "$(jq -r '.useLibrary' "$top/package.json")" = "true" ]; then
    echo "[test] WARNING: You are using the reference implementation. Set useLibrary to false in package.json to run your own implementation."
fi

# Run the constructed jest command with the rest of the arguments
# shellcheck disable=SC2294
if [ -n "$PATTERN" ]; then
    MATCH_FLAGS=""
    if [[ "$PATTERN" == s* ]]; then
        # npm test -- sN: only run scenarios for milestone N
        MILESTONE="${PATTERN/#s/m}" # sN -> mN
        MATCH_FLAGS+=" --testMatch \"**/*${MILESTONE}*.scenario.js\""
    else
        if [[ "$PATTERN" == *.js ]]; then
            MATCH_FLAGS+=" --testMatch \"**/*${PATTERN}\""
        elif [[ "$PATTERN" == *scenario* || "$PATTERN" == *extra* || "$PATTERN" == *test* ]]; then
            MATCH_FLAGS+=" --testMatch \"**/*${PATTERN}*.js\""
        else
            # npm test -- mN: run all tests for milestone N
            MATCH_FLAGS+=" --testMatch \"**/*${PATTERN}*test*.js\""
            MATCH_FLAGS+=" --testMatch \"**/*${PATTERN}*.extra.test.js\""
            MATCH_FLAGS+=" --testMatch \"**/*${PATTERN}*.scenario.js\""
        fi
    fi

    eval "$JEST_COMMAND $MATCH_FLAGS $JEST_COMMAND_FLAGS"
    exit $?
else
    eval "$JEST_COMMAND $JEST_COMMAND_FLAGS"
    exit $?
fi
